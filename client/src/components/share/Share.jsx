import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";

const Share = () => {
  const queryClient = useQueryClient()
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState(() => '');
  const { currentUser } = useContext(AuthContext)

  // Upload image
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  // Mutations
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post('/posts', newPost)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
  //handleShare
  const handleShare = async (e) => {
    e.preventDefault();
    let img = ''
    if (file) img = await upload()
    mutation.mutate({ desc, img })
    setDesc('')
    setFile(null)
  }



  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <input type="text" value={desc} placeholder={`What's on your mind ${currentUser.name}?`} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
