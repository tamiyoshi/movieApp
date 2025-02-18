import React from 'react'
import { IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export const PrevArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        aria-label="前へ"
        style={{
            position: 'absolute',
            top: '50%',
            left: '-25px',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}>
        <ArrowBackIosIcon style={{ color: '#000', fontSize: '2rem' }} />
    </IconButton>
)

export const NextArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        aria-label="次へ"
        style={{
            position: 'absolute',
            top: '50%',
            right: '-25px',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}>
        <ArrowForwardIosIcon style={{ color: '#000', fontSize: '2rem' }} />
    </IconButton>
)
