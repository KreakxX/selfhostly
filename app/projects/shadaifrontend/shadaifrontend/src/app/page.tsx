"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Code, Zap } from "lucide-react";
import { getAIRepsonse } from "./api";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedComponent, setGeneratedComponent] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const response = await getAIRepsonse(prompt);
    console.log(response);
    setGeneratedComponent(response);
  };

  const scope = {
    Button: Button,
    Card: Card,
    CardContent: CardContent,
    CardHeader: CardHeader,
    CardTitle: CardTitle,
    CardDescription: CardDescription,
    Input: Input,
    Label: Label,
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 ">
      <div className="w-full ">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4 "></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-zinc-100">
                Describe Your Component
              </h2>
            </div>
            <Textarea
              placeholder="e.g., Create a modern pricing card with three tiers, gradient background, and hover effects..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-40 mb-4 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:ring-zinc-900 focus:border-zinc-700 resize-none"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full bg-zinc-900  text-white font-medium"
            >
              Generate
            </Button>

            <SyntaxHighlighter
              language="jsx"
              style={vscDarkPlus}
              className="text-xs rounded-md border border-zinc-700"
              customStyle={{
                margin: 0,
                padding: "12px",
                backgroundColor: "rgb(24 24 27 / 0.5)",
                fontSize: "0.75rem",
              }}
            >
              {generatedComponent}
            </SyntaxHighlighter>
          </Card>

          <Card className="p-6 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">
                Live Preview
              </h2>
            </div>
            <div className="min-h-96 bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 overflow-auto">
              {generatedComponent ? (
                <div className="space-y-4">
                  <div className="pt-4 border-t border-zinc-700 ">
                    <LiveProvider
                      code={generatedComponent}
                      scope={scope}
                      noInline={false}
                    >
                      <LivePreview />
                      <LiveError />
                    </LiveProvider>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p>Your generated component will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
