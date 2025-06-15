
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const timelineData = [
  {
    year: "2024",
    achievements: [
      {
        title: "Lead AI Developer at Future Systems",
        description: "Leading a team to develop next-generation AI models for creative content generation.",
      },
      {
        title: "Published 'The Conscious Algorithm'",
        description: "A paper on ethical AI and model consciousness, presented at AI Global Summit.",
      },
    ],
  },
  {
    year: "2023",
    achievements: [
      {
        title: "Senior Machine Learning Engineer",
        description: "Worked on large-scale language models and recommender systems.",
      },
      {
        title: "Open Source Contributor",
        description: "Contributed to major open source ML libraries like TensorFlow and PyTorch.",
      },
    ],
  },
  {
    year: "2022",
    achievements: [
      {
        title: "Data Scientist at Innovate Corp",
        description: "Developed predictive models for customer churn and market trend analysis.",
      },
      {
        title: "Master's Degree in Computer Science",
        description: "Specialized in Artificial Intelligence and Machine Learning from Stanford University.",
      },
    ],
  },
    {
    year: "2021",
    achievements: [
      {
        title: "Machine Learning Intern",
        description: "Built and deployed a sentiment analysis tool for social media data.",
      },
    ],
  },
  {
    year: "2020",
    achievements: [
      {
        title: "Started my journey into AI",
        description: "Began with online courses and personal projects, sparking a lifelong passion.",
      },
    ],
  },
];

const Timeline = () => {
  return (
    <div className="relative max-w-4xl mx-auto py-12">
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-full w-1 bg-border rounded-full"></div>
      {timelineData.map((item, index) => (
        <div key={item.year} className="relative mb-12 flex md:justify-center items-start">
          <div className="hidden md:block w-5/12">
            {index % 2 === 0 && (
              <div className="text-right pr-16">
                <h2 className="text-3xl font-bold mb-6">{item.year}</h2>
                <div className="space-y-6">
                  {item.achievements.map((ach, i) => (
                    <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-left">
                      <CardHeader>
                        <CardTitle>{ach.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{ach.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center ring-8 ring-background">
             <span className="text-primary-foreground font-bold text-sm">{item.year.substring(2)}</span>
          </div>

          <div className="w-full md:w-5/12 pl-12 md:pl-0">
             <div className="md:hidden text-left mb-6">
                <h2 className="text-3xl font-bold">{item.year}</h2>
             </div>
            {index % 2 !== 0 && (
              <div className="md:text-left md:pl-16">
                 <h2 className="hidden md:block text-3xl font-bold mb-6">{item.year}</h2>
                <div className="space-y-6">
                  {item.achievements.map((ach, i) => (
                    <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>{ach.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{ach.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
             <div className="md:hidden space-y-6">
                {item.achievements.map((ach, i) => (
                    <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>{ach.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{ach.description}</p>
                      </CardContent>
                    </Card>
                  ))}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
