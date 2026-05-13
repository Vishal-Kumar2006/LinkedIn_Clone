import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    try {
      const { file, body } = userData;
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        return thunkAPI.fulfillWithValue("Post Uploaded Successfully");
      } else {
        return thunkAPI.rejectWithValue("Post not uploaded");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const incrementPostLike = createAsyncThunk(
  "post/incrementPostLike",
  async (post, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", {
        postId: post.postId,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (post, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_All_Comments", {
        params: { postId: post.postId },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment_post", {
        postId: commentData.postId,
        commentBody: commentData.comment,
        token: localStorage.getItem("token"),
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);
