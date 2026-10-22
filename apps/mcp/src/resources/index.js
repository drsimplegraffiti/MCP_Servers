export function registerResources(server) {
  server.registerResource(
    'posts-api-guide',
    'https://posts-api.example/guide',
    {
      title: 'Posts API Guide',
      description:
        'Guide for creating and managing posts (e.g. national duty). Categories: tech, finance, lifestyle. Title min 5 chars, author min 3, body min 50.',
      mimeType: 'text/plain',
    },
    async () => {
      return {
        contents: [
          {
            uri: 'https://posts-api.example/guide',
            text: 'Posts API: create_post (title, author, category, body), get_post(postId), update_post(postId, ...), delete_post(postId), list_posts. Categories: tech, finance, lifestyle. Use this workflow for a "national duty" post: create → edit → view → delete.',
          },
        ],
      };
    }
  );
}
