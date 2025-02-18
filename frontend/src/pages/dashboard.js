import AppLayout from '@/components/Layouts/AppLayout'
import MovieList from '@/components/MovieList'
import Head from 'next/head'
import { useEffect, useState } from 'react'
// import Search from '../components/SearchBar' 12/24 修正しました
import Search from '../components/Search'
import ReviewedMoviesList from '@/components/ReviewedMoviesList'
import { Box } from '@mui/material'

const Dashboard = () => {
    const [movies, setMovies] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const handleSearch = query => {
        setSearchQuery(query)
    }

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('api/getNowPlayingMovies')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setMovies(data.results)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchMovies()
    }, [])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }>
            <Head>
                <title>Dashboard - CinemaLoveReview</title>
            </Head>

            <Box sx={{ p: 3 }}>
                <Search onSearch={handleSearch} />
                <MovieList title="上映中の映画" movies={movies} />

                {/* レビュー済み映画の表示 */}
                <Box sx={{ mb: 4 }}>
                    <ReviewedMoviesList />
                </Box>
            </Box>
        </AppLayout>
    )
}

export default Dashboard
