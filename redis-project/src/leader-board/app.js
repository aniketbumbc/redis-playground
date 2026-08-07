import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis('redis://localhost:6380');
app.use(express.json());

const LEADER_BOARD_KEY = 'leaderboard:cricket_score';

/**
 *  Update the leader board score for a player
 */
app.put('/leader-board/add-score', async (req, res) => {
  try {
    const { player, score } = req.body;

    if (!player || !score) {
      return res.status(400).json({ message: 'Player and score are required' });
    }

    await redis.zadd(LEADER_BOARD_KEY, score, player);
    res
      .status(200)
      .json({ message: 'Leader board score updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update leader board score' });
  }
});

/**
 *  post for add score for a player
 */
app.post('/leader-board/add-score', async (req, res) => {
  try {
    const { player, score } = req.body;
    if (!player || !score) {
      return res.status(400).json({ message: 'Player and score are required' });
    }

    await redis.zincrby(LEADER_BOARD_KEY, score, player);
    const newScore = await redis.zscore(LEADER_BOARD_KEY, player);
    res.status(200).json({
      message: 'Leader board score incremented successfully',
      score: newScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to increment leader board score' });
  }
});

/**
 *  Get rank for given player
 */
app.post('/leader-board/get-rank', async (req, res) => {
  try {
    const { player } = req.body;
    if (!player) {
      return res.status(400).json({ message: 'Player is required' });
    }
    // check if player exists
    const playerExists = await redis.zscore(LEADER_BOARD_KEY, player);
    if (!playerExists) {
      return res.status(400).json({ message: 'Player does not exist' });
    }

    const rank = await redis.zrevrank(LEADER_BOARD_KEY, player);
    res.status(200).json({ rank: rank + 1 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get leader board rank' });
  }
});

/**
 *  see leader board
 */
app.get('/leader-board/see-leader-board', async (req, res) => {
  try {
    const leaderBoard = await redis.zrevrange(
      LEADER_BOARD_KEY,
      0,
      -1,
      'WITHSCORES',
    );
    res.status(200).json({ leaderBoard });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get leader board' });
  }
});

/**
 *  removed player from leader board
 *
 */
app.post('/leader-board/remove-player', async (req, res) => {
  try {
    const { player } = req.body;
    if (!player) {
      return res.status(400).json({ message: 'Player is required' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to remove player from leader board' });
  }
});

/**
 *  I want to see top 10 players in leader board
 */
app.get('/leader-board/top-10-players', async (req, res) => {
  try {
    const top10Players = await redis.zrevrange(
      LEADER_BOARD_KEY,
      0,
      9,
      'WITHSCORES',
    );
    res.status(200).json({ top10Players });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to get top 10 players from leader board' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
