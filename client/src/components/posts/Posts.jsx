import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'


const Posts = (userId) => {

  const { isLoading, error, data } = useQuery(['posts'], () =>
    makeRequest.get(`/posts`).then(res => {
      return res.data
    }))
  return <div className="posts">
    {
      error ? "something wrong"
        : isLoading ? "loading"
          : data.map((post) => (<Post key={post.id} post={post} />))
    }
  </div>;
};

export default Posts;
