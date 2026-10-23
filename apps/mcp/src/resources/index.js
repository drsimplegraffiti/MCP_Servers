export function registerResources(server) {
    server.registerResource(
        'NTA-news-guide',
        'https://news-api.example/guide',
        {
            title: 'NTA news API Guide',
            description:
                'Guide for creating and managing NTA news(e.g. Insecurity). Categories: tech, finance, lifestyle. Title min 5 chars, author min 3, body min 50.',
            mimeType: 'text/plain',
        },
        async () => {
            return {
                contents: [
                    {
                        uri: 'https://news-api.example/guide',
                        text: 'News API: create_news (title, author, category, body), get_news(newsId), update_news(newsId, ...), delete_news(newsId), list_news. Categories: tech, finance, lifestyle. Use this workflow for a "national duty" news: create → edit → view → delete.',
                    },
                ],
            };
        }
    );
}
