// 必要なコンポーネントやライブラリをインポート
import AppLayout from '@/components/Layouts/AppLayout'
import laravelApiClient from '@/lib/laravelApiClient'
import { Card, CardMedia, Grid, Link, Box, Typography } from '@mui/material'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'

// Likeコンポーネントをエクスポート
export default function Like() {
    // データ取得用のfetcher関数を定義
    const fetcher = url => laravelApiClient.get(url).then(res => res.data)
    // SWRを使ってデータを取得
    const { data: likeItems, error, mutate } = useSWR('api/likes', fetcher)

    // 状態を保持するためのuseState
    const [items, setItems] = useState([])

    useEffect(() => {
        // likeItemsが更新されたときに状態を更新
        if (likeItems) {
            setItems(likeItems)
        }
    }, [likeItems])

    if (error) {
        return <div>エラーが発生しました</div>
    }

    // コンポーネントのレンダリング
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Like ({items.length})
                </h2>
            }>
            <Head>
                <title>Like - CinemaLoveReview</title>
            </Head>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    {items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Link
                                href={`/detail/movie/${item.id}`}
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
                                        image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                        alt={item.title}
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
                                            {item.title}
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
