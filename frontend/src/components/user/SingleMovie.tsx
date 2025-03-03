import { useEffect, useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";
import { convertReviewCount } from "../../utils/helper";
import { Button } from "../ui/button";

const convertDate = (date = "") => {
  return date.split("T")[0];
};

interface SingleMovieObj {
  id: string;
  title: string;
  storyLine: string;
  cast: [];
  writers: [];
  director: string;
  releseDate: string;
  genres: [];
  tags: [];
  language: string;
  poster: string;
  trailer: string;
  type: string;
  reviews: {};
}

function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [movie, setMovie] = useState<SingleMovieObj>({
    id: "",
    title: "",
    storyLine: "",
    cast: [],
    writers: [],
    director: "",
    releseDate: "",
    genres: [],
    tags: [],
    language: "",
    poster: "",
    trailer: "",
    type: "",
    reviews: {},
  });

  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const { movieId } = useParams();

  const fetchMovie = async () => {
    const { error, movie }: { error: string; movie: SingleMovieObj } =
      await getSingleMovie(movieId);
    if (error) {
      return updateNotification("error", error);
    }

    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) {
      return navigate("/auth/signin");
    }
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    // console.log(reviews);
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (!ready)
    return (
      <div className=" h-screen flex justify-center items-center dark:bg-primary ">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
    );

  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    language,
    releseDate,
    type,
    reviews,
    director,
    writers,
    cast,
    genres,
  } = movie;

  return (
    <div className=" min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        <video
          poster={poster}
          controls
          src={trailer}
          muted
          width={1200}
          height={720}
          className="mx-auto mt-5"
        ></video>
        <div className="">
          <div className="flex justify-between">
            <h1 className="xl:text-4xl lg:text-3xl text-2xl font-semibold py-3">
              {title}
            </h1>
            <div className="flex flex-col items-end">
              <RatingStar rating={reviews.ratingAvg} />
              <CustomButtonLink
                label={convertReviewCount(reviews.reviewCount) + " Reviews"}
                onClick={() => navigate("/movie/reviews/" + id)}
              />
              <CustomButtonLink
                label="Rate The Movie"
                onClick={handleOnRateMovie}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="">{storyLine}</p>

            <ListWithLabel label="Director:">
              <CustomButtonLink
                label={director.name}
                onClick={() => handleProfileClick(director)}
              />
            </ListWithLabel>

            <ListWithLabel label="Writers:">
              {writers.map((w) => (
                <CustomButtonLink key={w.id} label={w.name} />
              ))}
            </ListWithLabel>

            <ListWithLabel label="Cast:">
              {cast.map(({ profile, leadActor }) => {
                return (
                  leadActor && (
                    <CustomButtonLink label={profile.name} key={profile.id} />
                  )
                );
              })}
            </ListWithLabel>

            <ListWithLabel label="Language:">
              <CustomButtonLink label={language} clickable={false} />
            </ListWithLabel>

            <ListWithLabel label="Release Date:">
              <CustomButtonLink
                label={convertDate(releseDate)}
                clickable={false}
              />
            </ListWithLabel>

            <ListWithLabel label="Genres:">
              {genres.map((g) => (
                <CustomButtonLink label={g} key={g} clickable={false} />
              ))}
            </ListWithLabel>

            <ListWithLabel label="Type:">
              <CustomButtonLink label={type} clickable={false} />
            </ListWithLabel>

            <CastProfiles cast={cast} />
            <RelatedMovies movieId={movieId} />
          </div>
        </div>
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}

const ListWithLabel = ({ label, children }) => {
  return (
    <div className="flex space-x-3 items-center">
      <p className="">{label}</p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div className="">
      <h1 className="font-semibold text-2xl mb-2">Cast:</h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ profile, roleAs }) => {
          return (
            <div
              key={profile.id}
              className="basis-28 flex flex-col items-center text-center mb-4"
            >
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.avatar}
                alt=""
              />

              <Button variant="link" className="text-blue-500">
                {profile.name}
              </Button>

              <p className=" ">{roleAs}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleMovie;
