<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    // ユーザーの「いいね」した映画の詳細を取得するメソッド
    public function index() {
        
        // TMDBのAPIキーを取得
        $api_key = config('services.tmdb.api_key');
        // 現在認証されているユーザーを取得
        $user = Auth::user();

        $likes = Like::orderBy('order', 'asc')->get();
        $details = [];
        // 各「いいね」した映画について、TMDB APIを使用して詳細を取得
        foreach($likes as $like) {
            $tmdb_api_key = "https://api.themoviedb.org/3/movie/" . $like->movie_id . "?api_key=" . $api_key;
            $response = Http::get($tmdb_api_key);
            // APIリクエストが成功した場合、詳細を配列に追加
            if($response->successful()) {
                $details[] = $response->json();
            }
        }

        // 映画の詳細をJSON形式で返す
        return response()->json($details);
    }

    // 映画の「いいね」状態を切り替えるメソッド
    public function toggleLike(Request $request) {
        // リクエストデータを検証
        $validatedData = $request->validate([
            'movie_id' => 'required|integer',
        ]);

        // ユーザーが既に「いいね」しているかを確認
        $like = Like::where('user_id', Auth::id())
            ->where('movie_id', $validatedData['movie_id'])
            ->first();

        // 既に「いいね」している場合は削除し、そうでない場合は新たに作成
        if ($like) {
            $like->delete();
            return response()->json(['status' => 'removed']);
        } else {
            // 現在の「いいね」されたアイテム数を取得し、1を加える
            $currentLikeCount = Like::where('user_id', Auth::id())->count();
            $newOrder = $currentLikeCount + 1;

            Like::create([
                'movie_id' => $validatedData['movie_id'],
                'user_id' => Auth::id(),
                'order' => $newOrder, // 新しいorder値を設定
            ]);
            return response()->json(['status' => 'added']);
        }
    }

    // 映画が「いいね」されているかを確認するメソッド
    public function checkLikeStatus(Request $request) {
        // リクエストデータを検証
        $validatedData = $request->validate([
            'movie_id' => 'required|integer',
        ]);

        // 映画が「いいね」されているかを確認
        $isLike = Like::where('user_id', Auth::id())
        ->where('movie_id', $validatedData['movie_id'])
        ->exists();

        // 結果をJSON形式で返す
        return response()->json($isLike);
    }
}
