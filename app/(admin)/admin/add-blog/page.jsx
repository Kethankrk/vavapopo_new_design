"use client";
import { db, imageDb } from "@/app/firebase/firebaseinit";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Button } from "@material-tailwind/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
// import MDEditor from "@uiw/react-md-editor";
// import {
//   headingsPlugin,
//   listsPlugin,
//   MDXEditor,
//   quotePlugin,
//   thematicBreakPlugin,
// } from "@mdxeditor/editor";
// import "@mdxeditor/editor/style.css";
// import MDEditor from "@uiw/react-md-editor";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 } from "uuid";

const Page = () => {
  // const [markdown, setMarkdown] = useState("Nothing");
  const editor = useCreateBlockNote({});
  const router = useRouter();
  const [data, setData] = useState({
    blogTitle: "",
    description: "",
    coverImage: null,
    tags: [],
    blog: "",
    readtime: "",
  });
  const [tag, setTag] = useState("");

  const addTags = () => {
    if (tag.trim() !== "") {
      const newTags = [...data.tags, tag];
      setData({ ...data, tags: newTags });
      setTag("");
    }
  };

  const stripMarkdown = (markdown) => {
    return markdown
      .replace(/[#*>\-`~_]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`.*?`/g, "")
      .replace(/\n+/g, " ")
      .trim();
  };
  const countWords = (text) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };
  const calculateReadingTime = () => {
    const plainText = stripMarkdown(data.blog);
    const wordCount = countWords(plainText);
    const wpm = 250;
    const readingTimeMinutes = wordCount / wpm;
    return Number(readingTimeMinutes).toFixed(0);
  };

  const uploadFileToFirebase = async (image) => {
    const imageName = `blogs/${v4()}`;
    const storageRef = ref(imageDb, imageName);
    const uploadResult = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(uploadResult.ref);
    return { url: url, path: imageName };
  };
  const submit = async () => {
    try {
      toast.info("Uploading data...", {
        toastId: "blog-upload",
        autoClose: false,
        closeOnClick: false,
        theme: "colored",
      });
      setData((prev) => ({
        ...prev,
        readtime: Number(calculateReadingTime()),
      }));
      const imageUrl = await uploadFileToFirebase(data.coverImage);
      const blogCollection = collection(db, "blogs");
      const finalData = {
        ...data,
        coverImage: imageUrl,
        date: new Date(),
      };
      await addDoc(blogCollection, finalData);
      toast.update("blog-upload", {
        render: "Successfully created blog, you will be redirected",
        theme: "colored",
        type: "success",
        autoClose: 1000,
        onClose: () => {
          router.replace("/admin");
        },
      });
    } catch (error) {
      console.log(error);
      toast.update("blog-upload", {
        render: "Unkown error occured",
        type: "error",
        theme: "colored",
        autoClose: 1000,
        theme: "colored",
      });
    }
  };

  const removeTag = (index) => {
    const newTags = [...data.tags];
    newTags.splice(index, 1);
    setData({ ...data, tags: newTags });
  };

  const onMarkdownChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setData({ ...data, blog: markdown });
    setData({ ...data, readtime: calculateReadingTime() });
  };

  return (
    <div className="min-h-screen p-4 xl:ml-72 w-full">
      <ToastContainer />
      <p className="text-sm font-medium mb-10">Add Blog</p>
      <form className="grid grid-cols-1 gap-5 bg-white p-5 rounded-md">
        <div className="">
          <label htmlFor="" className="font-medium text-sm">
            Blog title:
          </label>
          <br />
          <input
            type="text"
            className="mt-2 custom-input"
            placeholder="Title"
            required
            value={data.blogTitle}
            onChange={(e) =>
              setData((prev) => ({ ...prev, blogTitle: e.target.value }))
            }
          />
        </div>
        <div className="">
          <label htmlFor="" className="font-medium text-sm">
            Blog Description:
          </label>
          <br />
          <textarea
            rows={5}
            type="text"
            className="mt-2 custom-input"
            placeholder="Description for SEO"
            required
            value={data.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="">
          <label htmlFor="" className="font-medium text-sm">
            Cover image:
          </label>
          <br />
          <input
            type="file"
            className="mt-2 "
            placeholder="Cover image"
            required
            onChange={(e) =>
              setData((prev) => ({ ...prev, coverImage: e.target.files[0] }))
            }
          />
        </div>
        <div className="">
          <label htmlFor="" className="font-medium text-sm">
            Blog Tags:
          </label>
          <br />
          <input
            type="text"
            className="mt-2 custom-input"
            placeholder="Tags"
            required
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {/* <button
            type="button"
            onClick={addTags}
            className="ml-2 py-1 bg-blue-500 text-white rounded px-5"
          >
            Add
          </button> */}
          <Button
            onClick={addTags}
            disabled={tag.trim() !== "" ? false : true}
            color="blue"
            variant="gradient"
            className="ml-2 py-2.5"
          >
            {" "}
            Add
          </Button>
          <div className="mt-2">
            {data.tags.map((t, index) => (
              <span
                key={index}
                className="mr-2 p-1 px-3 bg-gray-200 rounded-full relative"
              >
                {t}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3 absolute top-0 -right-1 bg-red-500 rounded-full text-white"
                  onClick={(e) => removeTag(index)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </span>
            ))}
          </div>
        </div>
        <div className="">
          <label htmlFor="" className="font-medium text-sm">
            Blog :
          </label>
          <br />
          {/* <MDEditor
            className="mt-3"
            value={data.blog}
            onChange={(value) => setData((prev) => ({ ...prev, blog: value }))}
            preview="edit"
            data-color-mode="light"
          /> */}
          {/* <MDEditor
            value={markdown}
            onChange={setMarkdown}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          /> */}
          <div className="py-4 px-1 min-h-24 border rounded-lg mt-4">
            <BlockNoteView
              editor={editor}
              onChange={onMarkdownChange}
              theme={"light"}
            />
          </div>
        </div>
        <div className="flex justify-end gap-1">
          {" "}
          <p>Reading time: </p>
          <p>{calculateReadingTime()}</p>
          <p>minutes</p>
        </div>
        <div className="">
          <Button color="green" variant="gradient" onClick={submit}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
