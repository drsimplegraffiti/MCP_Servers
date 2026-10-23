export function registerPrompts(server) {
    server.registerPrompt(
        'newsmania',
        {
            title: 'Newsmania: Creates, Edits, Views, and Deletes News',
            description:
                'Create, edit, view, and delete news about NTA news in Nigeria.',
        },
        async () => {
            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `You must use the News API tools in this exact order. Do each step and use the news ID from step 1 for steps 2, 3, and 4.

1) CREATE: Call create_news to create a new news about "NTA news in Nigeria". Use:
   - title: at least 5 characters (e.g. "NTA news in Nigeria about fuel prices spike")
   - author: at least 3 characters (e.g. "Jane Doe")
   - category: one of tech, finance, or  insecurity(e.g. "lifestyle")
   - body: at least 50 characters describing at least a CNN news story about Nigeria.

2) EDIT: Call update_news with the _id returned from step 1. Change the title or body to an edited version (e.g. add a sentence or refine the message). Keep author and category the same; title and body must still meet minimum length rules.

3) VIEW: Call get_news with the same news _id to fetch and show the current news.

4) DELETE: Call delete_news with the same news _id to remove the news.

After each tool call, report the result briefly. Complete all four steps in order.`,
                        },
                    },
                ],
            };
        }
    );
}
