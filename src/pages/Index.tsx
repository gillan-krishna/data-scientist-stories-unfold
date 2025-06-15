
import Layout from "@/components/Layout";
import Timeline from "@/components/Timeline";

const Index = () => {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">AI research and products that put safety at the frontier</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A personal journey through my achievements, putting passion and learning at the frontier of technology.
        </p>
      </div>
      <Timeline />
    </Layout>
  );
};

export default Index;
