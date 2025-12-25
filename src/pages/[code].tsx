import { GetServerSideProps } from 'next';
import Head from 'next/head';
import pool, { initDatabase } from '@/lib/db';

export default function Redirect() {
  return (
    <>
      <Head>
        <title>Redirecting...</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.params!;

  if (typeof code !== 'string') {
    return { notFound: true };
  }

  try {
    // Ensure database is initialized
    await initDatabase();
    
    const result = await pool.query(
      `SELECT target_url, id
       FROM links
       WHERE code = $1 AND deleted_at IS NULL`,
      [code]
    );

    if (result.rows.length === 0) {
      return { notFound: true };
    }

    const { target_url, id } = result.rows[0];

    await pool.query(
      `UPDATE links 
       SET clicks = clicks + 1, 
           last_clicked_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    ).catch((err) => {
      console.error('Error updating click count:', err);
    });

    
    return {
      redirect: {
        destination: target_url,
        permanent: false, 
      },
    };
  } catch (error) {
    console.error('Error redirecting:', error);
    return { notFound: true };
  }
};

