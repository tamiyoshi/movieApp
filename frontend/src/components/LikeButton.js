import { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'
import laravelApiClient from '@/lib/laravelApiClient'

// LikeButtonコンポーネントは、映画のIDを受け取り、その映画が「いいね」されているかどうかを表示するボタンを提供します。
export default function LikeButton({ movieId }) {
    // likedは、映画が「いいね」されているかどうかを示す状態です。
    const [liked, setLiked] = useState(false)

    // useEffectフックは、コンポーネントがマウントされたとき、またはmovieIdが変更されたときに実行されます。
    useEffect(() => {
        // fetchLikes関数は、映画の「いいね」状態をAPIから取得します。
        const fetchLikes = async () => {
            try {
                // laravelApiClientを使用して、映画の「いいね」状態を取得します。
                const likeResponse = await laravelApiClient.get(
                    'api/likes/status',
                    {
                        params: {
                            movie_id: movieId, // クエリパラメータとしてmovieIdを送信
                        },
                    },
                )
                // APIからのレスポンスデータをliked状態に設定します。
                setLiked(likeResponse.data)
                console.log(likeResponse.data) // likeResponse.dataがtrueかfalseかをチェック
            } catch (error) {
                // エラーが発生した場合、エラーメッセージをコンソールに出力します。
                console.log(error)
            }
        }
        // fetchLikes関数を呼び出します。
        fetchLikes()
    }, [movieId]) // movieIdが変わるたびにfetchLikesを再実行します。

    // handleLikeClick関数は、ユーザーが「いいね」ボタンをクリックしたときに呼び出されます。
    const handleLikeClick = async () => {
        try {
            // laravelApiClientを使用して、映画の「いいね」状態を切り替えます。
            const response = await laravelApiClient.post('api/likes', {
                movie_id: movieId, // ボディパラメータとしてmovieIdを送信
            })
            // レスポンスのステータスが'added'の場合、liked状態をtrueに設定します。
            console.log(response.data)
            setLiked(response.data.status === 'added')
        } catch (error) {
            // エラーが発生した場合、エラーメッセージをコンソールに出力します。
            console.log(error)
        }
    }

    // ボタンをレンダリングし、liked状態に応じて異なるアイコンを表示します。
    return (
        <IconButton onClick={handleLikeClick}>
            {liked ? (
                <FavoriteIcon sx={{ fontSize: 40 }} color="error" />
            ) : (
                <FavoriteBorderIcon sx={{ fontSize: 40 }} />
            )}
        </IconButton>
    )
}
