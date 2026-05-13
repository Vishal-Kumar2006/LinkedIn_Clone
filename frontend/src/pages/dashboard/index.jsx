import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPost,
  createPost,
  deletePost,
  incrementPostLike,
  getAllComments,
  postComment,
} from "@/config/redux/action/postAction";
import { getAllUsers, getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import style from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

function DashBoard() {
  const router = useRouter();
  const dispath = useDispatch();
  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.post);

  const [postContent, stePostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const handleUpload = async () => {
    await dispath(createPost({ file: fileContent, body: postContent }));
    stePostContent("");
    setFileContent(null);
    dispath(getAllPost());
  };

  useEffect(() => {
    if (authState.isTokenThere) {
      dispath(getAllPost());
      dispath(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.all_profiles_fetched) {
      dispath(getAllUsers());
    }
  }, [authState.isTokenThere]);

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={style.scrollComponent}>
            <div className={style.wrapper}>
              <div className={style.createrPostContainer}>
                <img
                  className={style.userProfile}
                  width={100}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt=""
                />
                <textarea
                  className={style.textAreaContent}
                  name=""
                  onChange={(e) => stePostContent(e.target.value)}
                  value={postContent}
                  placeholder="What's in your mind ?"
                  id=""></textarea>
                <label htmlFor="fileUpload">
                  <div className={style.Fab} style={{ cursor: "pointer" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files[0])}
                  type="file"
                  id="fileUpload"
                  hidden
                />
                {0 < postContent.length && (
                  <div onClick={handleUpload} className={style.uploadButton}>
                    Post
                  </div>
                )}
              </div>

              <div className={style.postsContainer}>
                {postState.posts.map((post) => {
                  return (
                    <div key={post._id} className={style.singleCard}>
                      <div className={style.singleCard_ProfileContainer}>
                        <img
                          className={style.singleCard_UserImage}
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt="User's Image"
                        />
                        <div>
                          <div
                            onClick={async () => {
                              await dispath(deletePost({ post_id: post._id }));
                              await dispath(getAllPost());
                            }}
                            style={{
                              display: "flex",
                              gap: "1.2rem",
                              justifyContent: "space-between",
                            }}>
                            <p style={{ fontWeight: "bold" }}>
                              {post.userId.name}
                            </p>
                            {post.userId._id === authState.user.userId._id && (
                              <div style={{ cursor: "pointer" }}>
                                <svg
                                  style={{
                                    height: "1.4rem",
                                    color: "red",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p style={{ color: "gray" }}>
                            @{post.userId.userName}
                          </p>

                          <div className={style.singleCard_Image}>
                            <p>{post.body}</p>
                            {post.media !== "" && (
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt="Post Image"
                              />
                            )}
                          </div>

                          <div className={style.optionsContainer}>
                            <div
                              onClick={async () => {
                                await dispath(
                                  incrementPostLike({ postId: post._id }),
                                );
                                await dispath(getAllPost());
                              }}
                              className={style.singleOption_OptionContainer}>
                              <p> {post.likes} </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                />
                              </svg>
                            </div>

                            <div
                              onClick={async () => {
                                await dispath(
                                  getAllComments({ postId: post._id }),
                                );
                              }}
                              className={style.singleOption_OptionContainer}>
                              <p>{post.comments.length}</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                />
                              </svg>
                            </div>

                            <div
                              onClick={() => {
                                const text = encodeURIComponent(post.body);
                                const url =
                                  encodeURIComponent("apnacollege.in");
                                const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                window.open(twitterUrl, "_blank");
                              }}
                              className={style.singleOption_OptionContainer}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {postState.postId !== "" && (
            <div
              onClick={() => {
                dispath(resetPostId());
              }}
              className={style.commentsContainer}>
              <div
                onClick={(e) => e.stopPropagation()}
                className={style.allCommentsContainer}>
                {postState.comments.length === 0 && <h3>No comment yet</h3>}
                {postState.comments.length !== 0 && (
                  <div className={style.showAll_CommentsContain}>
                    <h3>Comment's</h3>
                    <div className={style.show_Comments_Container}>
                      {postState.comments.map((comment) => {
                        return (
                          <div
                            key={comment._id}
                            className={style.showCommentContainer}>
                            <div
                              className={style.showCommentContainer_UserDetail}>
                              <img
                                src={`${BASE_URL}/${comment.userId.profilePicture}`}
                                alt="CommentUser Name"
                              />
                              <div>
                                <p style={{ fontWeight: "bold" }}>
                                  {comment.userId.name}
                                </p>
                                <p>{comment.userId.userName}</p>
                              </div>
                            </div>
                            <div
                              className={
                                style.showCommentContainer_CommentDetails
                              }>
                              <p>{comment.body}</p>
                              <p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                  />
                                </svg>
                                {comment.likes}
                              </p>
                              {/* <div
                                className={style.showComment_RepliesContainer}>
                                Show Replies from here 
                                  comment.replies
                                
                              </div> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className={style.postCommentContainer}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter your Comment"
                  />
                  <div
                    onClick={async () => {
                      await dispath(
                        postComment({
                          postId: postState.postId,
                          comment: commentText,
                        }),
                      );
                      await dispath(
                        getAllComments({ postId: postState.postId }),
                      );
                      setCommentText("");
                    }}
                    className={style.postCommentontainer_commentBtn}>
                    <p>Comment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="scrollComponent">
            <div className="createrPostContainer">
              <h2>Loading</h2>
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
}

export default DashBoard;
