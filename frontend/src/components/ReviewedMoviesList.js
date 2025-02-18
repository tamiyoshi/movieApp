import React, { useState, useEffect } from 'react'
import laravelApiClient from '@/lib/laravelApiClient'
import { Card, CardMedia, Grid, Link, Box, Typography } from '@mui/material'

export default function ReviewedMoviesList() {
    const [reviewedMovies, setReviewedMovies] = useState([])

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
        <Box sx={{ p: 3 }}>
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
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
                                <Box sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
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
    )
}
