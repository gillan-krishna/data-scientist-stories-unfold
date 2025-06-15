
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "Understanding Transformer Networks",
    description: "A deep dive into the architecture that powers modern LLMs.",
    date: "June 10, 2025",
    readTime: "15 min read",
  },
  {
    title: "Pastel Palettes in UI Design",
    description: "How to use soft colors to create calming and beautiful user interfaces.",
    date: "May 22, 2025",
    readTime: "8 min read",
  },
  {
    title: "The Ethics of Artificial Intelligence",
    description: "Exploring the complex moral questions raised by advanced AI.",
    date: "April 15, 2025",
    readTime: "20 min read",
  },
];

const Blog = () => {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">From My Desk</h1>
        <p className="text-xl text-muted-foreground">Thoughts on technology, design, and everything in between.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Could have an image here */}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{post.date}</span>
              <Button variant="link">Read More &rarr;</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Blog;
