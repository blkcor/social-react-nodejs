import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const Profile = () => {
  const userId = useLocation().pathname.split('/')[2]
  const { currentUser } = useContext(AuthContext)

  const { uIsLoading, uError, data } = useQuery(['user'], () =>
    makeRequest.get('/users/find/' + userId).then(res => {
      return res.data
    })
  )

  const { rIsLoading, rError, data: relationshipData } = useQuery(['relationships'],
    () => makeRequest.get('/relationships?followedUserId=' + userId).then(result => {
      return result.data
    })
  )

  const queryClient = useQueryClient()
  const rMutation = useMutation({
    mutationFn: (follow) => {
      if (follow)
        return makeRequest.delete(`/relationships?followedUserId=${userId}`)
      return makeRequest.post(`/relationships`, { followedUserId: userId })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['relationships'] })
    },
  })

  const handleFollow = () => {
    rMutation.mutate(relationshipData?.includes(currentUser.id))
  }

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data?.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={data?.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {
              currentUser.id === parseInt(userId) ?
                <button>update</button> :
                relationshipData?.includes(currentUser.id) ?
                  <button onClick={handleFollow}>following</button> :
                  <button onClick={handleFollow}>follow</button>
            }
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts />
      </div>
    </div >
  );
};

export default Profile;
