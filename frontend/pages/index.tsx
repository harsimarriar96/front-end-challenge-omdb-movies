import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { debounce } from 'lodash';
import Image from 'next/image';
import { Toggle, MovieCard, SearchBar, Banner } from '../components';
import BannerTypes from '../types/BannerTypes';
import Movie from '../types/Movie';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input field.
  const [movies, setMovies] = useState([]); // List of movies fetched from OMDB.
  const [nominatedMoviesList, setNominatedMoviesList] = useState<Movie[]>([]); // Nominated movies list array from the local storage.
  const [isLoading, setIsLoading] = useState<boolean>(false); // Handle loader
  const [hasErrors, setHasErrors] = useState<boolean>(false); // In case of any API call failure.
  const [showAllNominatedMoviesOnly, setShowAllNominatedMoviesOnly] =
    useState<boolean>(false); // Show all Nominated movies toggle.

  // Get list of movies from OMDB through their Search API whenever the search input is updated.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getMoviesList = useCallback(
    debounce(async (query) => {
      setIsLoading(true);
      setShowAllNominatedMoviesOnly(false);
      try {
        const response = await axios.get(
          `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${query}&page=1&type=movie`
        );
        setMovies(response.data.Search || []);
      } catch (e) {
        // Handle all the exceptions.
        setHasErrors(true);
      }
      setIsLoading(false);
    }, 250),
    []
  );

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    getMoviesList(query);
  };

  const getNominatedMoviesList = async () => {
    const nominatedMoviesList = await localStorage.getItem('nominated-movies');
    setNominatedMoviesList(JSON.parse(nominatedMoviesList) || []);
  };

  const updateLocalStorage = async (movies) => {
    await localStorage.setItem('nominated-movies', JSON.stringify(movies));
  };

  // Clicking on Nominate button in movie card.
  const onClickNominate = async (movie: Movie) => {
    // check if movie already in the list
    if (nominatedMoviesList.length < 5) {
      const updatedNominatedMoviesList = [...nominatedMoviesList, movie];
      await updateLocalStorage(updatedNominatedMoviesList);
      setNominatedMoviesList(updatedNominatedMoviesList);
    }
    return;
  };

  // Clicking on Denominate button in movie card.
  const onClickDenominate = async (movie: Movie) => {
    // Get all movies except the current movie selected.
    const updatedNominatedMoviesList = nominatedMoviesList.filter(
      (item) =>
        item.Title !== movie.Title &&
        item.Poster !== movie.Poster &&
        item.Year !== movie.Year
    );
    await updateLocalStorage(updatedNominatedMoviesList);
    setNominatedMoviesList(updatedNominatedMoviesList);
    return;
  };

  // Check if a particular movie is nominated or not.
  const checkNominationStatus = (movie: Movie) => {
    const selectedMovie = nominatedMoviesList.find(
      (item) =>
        item.Title === movie.Title &&
        item.Poster === movie.Poster &&
        item.Year === movie.Year
    );
    return selectedMovie !== undefined ? true : false;
  };

  // Get Nominated movies list on initial load from db/localstorage.
  useEffect(() => {
    getNominatedMoviesList();
  }, []);

  // When the nomination list is empty, it should show all movies instead.
  useEffect(() => {
    if (nominatedMoviesList.length < 1) {
      setShowAllNominatedMoviesOnly(false);
    }
  }, [nominatedMoviesList]);

  return (
    <div className="mb-10">
      <Head>
        <title>OMDB Movies</title>
        <meta name="description" content="OMDB movies list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Show search bar */}

      <header>
        <div className="bg-cyan-800 py-20">
          <h1 className="text-center text-6xl uppercase text-white font-bold">
            OMDB Movies
          </h1>

          <SearchBar
            onChange={(e) => onChangeSearch(e.target.value)}
            value={searchQuery}
          />
        </div>
      </header>

      {/* Main section for all movies and toggle. */}
      <main>
        <div className="w-10/12 lg:w-8/12 mx-auto">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center mt-10">
            {/* Results header */}
            <h2 className="text-3xl font-bold">
              {searchQuery && !showAllNominatedMoviesOnly && (
                <>Results for &quot;{searchQuery}&quot;</>
              )}
            </h2>

            {/* Show only nominated movies toggle. */}
            {nominatedMoviesList.length > 0 && (
              <div className="flex items-center mr-3 mb-8 lg:mb-0">
                <p className="font-bold mr-3">Show all nominated movies only</p>
                <Toggle
                  onToggle={() =>
                    setShowAllNominatedMoviesOnly(!showAllNominatedMoviesOnly)
                  }
                  value={showAllNominatedMoviesOnly}
                />
              </div>
            )}
          </div>

          {searchQuery && (
            <>
              {/* Searching for movies */}
              {isLoading && (
                <div className="flex justify-center mt-10">
                  <Image
                    src="/loader.svg"
                    height={150}
                    width={150}
                    alt="OMDB Movies"
                  />
                </div>
              )}

              {/* No movies found */}
              {movies.length < 1 &&
                !isLoading &&
                !showAllNominatedMoviesOnly && (
                  <h4 className="text-2xl text-center text-gray-700 mt-10">
                    No movies found, try to change your search query.
                  </h4>
                )}

              {/* Banners */}
              {hasErrors && !isLoading && !showAllNominatedMoviesOnly && (
                <div className="mt-8">
                  <Banner type={BannerTypes.DANGER} show={hasErrors}>
                    Oops! Looks like something went wrong, please try again.
                  </Banner>
                </div>
              )}
            </>
          )}

          {!hasErrors && !isLoading && (
            <div className="mt-8">
              <Banner
                type={BannerTypes.INFO}
                show={nominatedMoviesList.length === 5 && movies.length > 0}
              >
                Wooho! You have nominated 5 movies.
              </Banner>
            </div>
          )}
          {/* List of movies */}
          <div className="mt-10 flex gap-10 overflow-auto flex-wrap">
            {searchQuery && (
              <>
                {!showAllNominatedMoviesOnly &&
                  !isLoading &&
                  !hasErrors &&
                  movies.map(({ Title, Year, Poster }: Movie) => {
                    return (
                      <MovieCard
                        title={Title}
                        year={Year}
                        key={Title}
                        isNominated={checkNominationStatus({
                          Title,
                          Year,
                          Poster,
                        })}
                        posterURI={Poster}
                        hasReachedNominationLimit={
                          nominatedMoviesList.length === 5
                        }
                        onClickNominate={() =>
                          onClickNominate({ Title, Year, Poster })
                        }
                        onClickDenominate={() =>
                          onClickDenominate({ Title, Year, Poster })
                        }
                      />
                    );
                  })}
              </>
            )}
            {/* List of nominations */}
            {showAllNominatedMoviesOnly &&
              !isLoading &&
              !hasErrors &&
              nominatedMoviesList.map(({ Title, Year, Poster }) => {
                return (
                  <MovieCard
                    title={Title}
                    year={Year}
                    key={Title}
                    posterURI={Poster}
                    hasReachedNominationLimit={nominatedMoviesList.length === 5}
                    onClickDenominate={() =>
                      onClickDenominate({ Title, Year, Poster })
                    }
                    isNominated
                  />
                );
              })}
          </div>

          {movies.length < 1 && !searchQuery && !showAllNominatedMoviesOnly && (
            <div className="text-center">
              <h2 className="text-6xl mb-3">Welcome to OMDB Movies</h2>
              <p className="text-lg">
                Please type in your search query to find movies.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
