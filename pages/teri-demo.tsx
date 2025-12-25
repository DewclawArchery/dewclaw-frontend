import TeriWidget from "../components/Teri/TeriWidget";


export default function TeriDemo() {
  return (
    <div style={{ padding: 24 }}>
      <h1>TERI Widget Demo</h1>
      <p>Open the widget in the bottom-right. Stub mode is enabled.</p>

      <TeriWidget
        useStub={true}
        pageContext={{
          path: "/teri-demo",
          title: "TERI Demo",
          headings: ["Demo"]
        }}
      />
    </div>
  );
}
