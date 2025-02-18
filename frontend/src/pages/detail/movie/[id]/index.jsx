import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import MovieDetail from './MovieDetail'
import MovieReviews from '@/components/MovieReviews'
import laravelApiClient from '@/lib/laravelApiClient'
import { Card, CardMedia, Grid, Link, Box, Typography } from '@mui/material'
import MovieList from '@/components/MovieList'
import ReviewedMoviesList from '@/components/ReviewedMoviesList'

export default function index({ movie, movieId }) {
    const [reviewedMovies, setReviewedMovies] = useState([])
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const fetchReviewedMovies = async () => {
            try {
                const response = await laravelApiClient.get(
                    '/api/reviewed-movies',
                )
                setReviewedMovies(response.data)
            } catch (error) {
                console.error(
                    'レビュー済み映画の取得中にエラーが発生しました:',
                    error,
                )
            }
        }

        fetchReviewedMovies()
    }, [])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Detail - CinemaLoveReview</title>
            </Head>

            <MovieDetail movie={movie} />
            <MovieReviews movieId={movieId} />
            <Box sx={{ p: 3 }}>
                {/* レビュー済み映画の表示 */}
                <Typography variant="h5" component="div" sx={{ mt: 4, mb: 2 }}>
                    レビュー済み映画一覧
                </Typography>
                <Grid container spacing={4}>
                    {reviewedMovies.map(movie => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                            <Link
                                href={`/detail/movie/${movie.id}`}
                                underline="none">
                                <Card
                                    sx={{
                                        maxWidth: 345,
                                        transition: 'transform 0.3s',
                                        boxShadow:
                                            '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow:
                                                '0 8px 16px rgba(0, 0, 0, 0.2)',
                                        },
                                    }}>
                                    <CardMedia
                                        component="img"
                                        height="500"
                                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: '#f9f9f9',
                                        }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                color: '#333',
                                            }}>
                                            {movie.title}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </AppLayout>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params

    try {
        // 日本語のあらすじを取得
        const responseJP = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )
        const movieJP = await responseJP.json()

        let overview = movieJP.overview
        // 日本語のあらすじがない場合、英語版を取得
        if (!overview) {
            const responseEN = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            const movieEN = await responseEN.json()
            overview = movieEN.overview
        }

        return { props: { movie: { ...movieJP, overview }, movieId: id } }
    } catch (error) {
        console.error('Error fetching movie details:', error)
        return { props: { movie: null } }
    }
}
