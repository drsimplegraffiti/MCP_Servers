export function registerPrompts(server) {
  server.registerPrompt(
    'national-duty-post-workflow',
    {
      title: 'National Duty Post: Create, Edit, View, Delete',
      description:
        'Runs all post tools in sequence: create a post on national duty, edit it, view it, then delete it.',
    },
    async () => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `You must use the Posts API tools in this exact order. Do each step and use the post ID from step 1 for steps 2, 3, and 4.

1) CREATE: Call create_post to create a new post about "national duty". Use:
   - title: at least 5 characters (e.g. "Why National Duty Matters")
   - author: at least 3 characters (e.g. "Jane Doe")
   - category: one of tech, finance, or lifestyle (e.g. "lifestyle")
   - body: at least 50 characters describing the importance of national duty, civic responsibility, or serving the country.

2) EDIT: Call update_post with the _id returned from step 1. Change the title or body to an edited version (e.g. add a sentence or refine the message). Keep author and category the same; title and body must still meet minimum length rules.

3) VIEW: Call get_post with the same post _id to fetch and show the current post.

4) DELETE: Call delete_post with the same post _id to remove the post.

After each tool call, report the result briefly. Complete all four steps in order.`,
            },
          },
        ],
      };
    }
  );
}
