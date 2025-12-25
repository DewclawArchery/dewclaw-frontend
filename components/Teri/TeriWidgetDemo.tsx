import { TeriWidget } from '@/components/teri';

export default function TeriWidgetDemo() {
  // Example page context - in real usage, this would be derived from your page
  const pageContext = {
    path: '/demo',
    title: 'TeriWidget Demo Page',
    headings: ['Welcome', 'Features', 'Getting Started'],
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">TeriWidget Demo</h1>
        <p className="text-muted-foreground mb-6">
          Click the "Ask T.E.R.I." button in the bottom-right corner to open the chat widget.
        </p>
        
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Soft & friendly design aesthetic</li>
              <li>Bottom sheet on mobile, floating panel on desktop</li>
              <li>Markdown rendering for TERI responses</li>
              <li>Session storage persistence</li>
              <li>Quick action chips for common queries</li>
              <li>Loading indicator while waiting for response</li>
            </ul>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">API Contract</h2>
            <p className="text-sm text-muted-foreground mb-2">
              The widget sends POST requests to <code className="px-1 bg-muted rounded">/api/teri/chat</code> with:
            </p>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`{
  "messages": [{ "role": "user", "content": "..." }],
  "pageContext": {
    "path": "/demo",
    "title": "Page Title",
    "headings": ["..."]
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* The TERI Widget */}
      <TeriWidget pageContext={pageContext} useStub={true} />
    </div>
  );
}
