import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";
import emoji from "remark-emoji";
import gfm from "remark-gfm";
import { format, parseISO } from "date-fns";

export type ArticleFrontmatter = {
  id: string;
  title: string;
  date: string;
  formattedDate?: string;
  readingTime?: string;
  author: string;
  shortTitle: string;
  description: string;
  imageUrl: string;
  tags: string[];
  isInDb: boolean;
  isDummy?: boolean;
  imageAttribution?: string;
};

const postsDirectory = path.join(process.cwd(), "articles");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const allPostsData = fileNames
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Add readingTime to matterResult.data to access it outside /pages/posts/[id].js
      const words = matterResult.content.split(" ").length;
      const wordsPerMinute = 130;
      const readingTime = Math.floor(words / wordsPerMinute).toString();

      matterResult.data.readingTime = readingTime;

      const formattedDate = format(
        parseISO(matterResult.data.date),
        "do 'of' MMM ''yy",
      );
      matterResult.data.formattedDate = formattedDate;

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      } as ArticleFrontmatter;
    });
  // Sort posts by date
  return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1);
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map(dirent => dirent.name);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(
  id: ArticleFrontmatter["id"],
): Promise<ArticleFrontmatter & { content: string }> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const words = matterResult.content.split(" ").length;
  const wordsPerMinute = 130;
  const readingTime = Math.floor(words / wordsPerMinute).toString();

  matterResult.data.readingTime = readingTime;

  const formattedDate = format(
    parseISO(matterResult.data.date),
    "do 'of' MMM ''yy",
  );
  matterResult.data.formattedDate = formattedDate;

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(gfm)
    .use(emoji, {
      padSpaceAfter: true,
      emoticon: false,
    })
    // @ts-ignore - because remark-prism v1.3.6 is not yet type-compatible with remark v15 but `build` still works
    .use(prism)
    .process(matterResult.content);
  const content = processedContent.toString();
  return {
    content,
    ...matterResult.data as ArticleFrontmatter,
  };
}
