// Shared type definitions for the URL shortener application

export interface Link {
    code: string;
    target_url: string;
    clicks: number;
    created_at: string;
    last_clicked_at: string | null;
}
