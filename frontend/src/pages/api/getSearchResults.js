import React from 'react'
import { IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export const PrevArrow = ({ onClick }) => (
    <IconButton onClick={onClick} aria-label="前へ">
        <ArrowBackIosIcon />
    </IconButton>
)

export const NextArrow = ({ onClick }) => (
    <IconButton onClick={onClick} aria-label="次へ">
        <ArrowForwardIosIcon />
    </IconButton>
)

export default async function handler(req, res) {
    const { query } = req.query // クエリパラメータから検索クエリを取得

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&query=${query}`,
        )
        if (!response.ok) {
            throw new Error('ネットワークエラーが発生しました')
        }
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        console.error('映画の取得中にエラーが発生しました:', error)
        res.status(500).json({
            message: 'エラーが発生しました',
            error: error.toString(),
        })
    }
}
