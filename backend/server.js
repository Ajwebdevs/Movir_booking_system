const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('node:path');
const app = express();
const port = 3000;

const db = new sqlite3.Database('./MovieSystem.db');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/movies', (req, res) => {
    db.all('SELECT * FROM Movies', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ movies: rows });
    });
});

app.get('/shows/:movie_id', (req, res) => {
    const { movie_id } = req.params;
    db.all('SELECT * FROM Shows WHERE movie_id = ?', [movie_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ shows: rows });
    });
});

app.post('/create_movie', (req, res) => {
    const { title, genre, duration, rating, image_url } = req.body;
    const stmt = db.prepare('INSERT INTO Movies (title, genre, duration, rating, image_url) VALUES (?, ?, ?, ?, ?)');
    stmt.run([title, genre, duration, rating, image_url], (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

app.delete('/remove_movie/:movie_id', (req, res) => {
    const { movie_id } = req.params;
    db.run('DELETE FROM Movies WHERE movie_id = ?', [movie_id], function (err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (this.changes > 0) {
            res.json({ success: true, message: 'Movie removed successfully' });
        } else {
            res.status(404).json({ success: false, error: 'Movie not found' });
        }
    });
});


app.delete('/remove_all_movies', (req, res) => {
  db.run('DELETE FROM Movies', [], (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'All movies removed successfully' });
  });
});


app.get('/seats/:show_id', (req, res) => {
    const { show_id } = req.params;
    db.all('SELECT * FROM Seats WHERE show_id = ? AND is_available = 1', [show_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ seats: rows });
    });
});

app.get('/check_booking/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  db.get(
      `SELECT
          Bookings.booking_id,
          Bookings.booking_time,
          Bookings.seat_id,
          Movies.title AS movie_title,
          Movies.genre AS movie_genre,
          Movies.duration AS movie_duration,
          Movies.rating AS movie_rating,
          Shows.show_time AS show_time
      FROM Bookings
      INNER JOIN Shows ON Bookings.show_id = Shows.show_id
      INNER JOIN Movies ON Shows.movie_id = Movies.movie_id
      WHERE Bookings.booking_id = ?`,
      [bookingId],
      (err, row) => {
          if (err) {
              return res.status(500).json({ success: false, error: err.message });
          }
          if (!row) {
              return res.status(404).json({ success: false, error: 'Booking not found' });
          }
          res.json({ success: true, booking: row });
      }
  );
});

// app.get('/check_booking/:bookingId', (req, res) => {
//     const { bookingId } = req.params;
//     db.get(
//         `SELECT
//             Bookings.booking_id,
//             Bookings.booking_time,
//             Bookings.seat_id,
//             Movies.title AS movie_title,
//             Movies.genre AS movie_genre,
//             Movies.duration AS movie_duration,
//             Movies.rating AS movie_rating,
//             Shows.show_time AS show_time
//         FROM Bookings
//         INNER JOIN Shows ON Bookings.show_id = Shows.show_id
//         INNER JOIN Movies ON Shows.movie_id = Movies.movie_id
//         WHERE Bookings.booking_id = ?`,
//         [bookingId],
//         (err, row) => {
//             if (err) {
//                 return res.status(500).json({ success: false, error: err.message });
//             }
//             if (!row) {
//                 return res.status(404).json({ success: false, error: 'Booking not found' });
//             }
//             res.json({ success: true, booking: row });
//         }
//     );
// });

app.post('/book_ticket', (req, res) => {
    const { customer_id, show_id, seat_id } = req.body;

    console.log("Received booking request:", req.body);

    db.run(
        'INSERT INTO Bookings (customer_id, show_id, seat_id) VALUES (?, ?, ?)',
        [customer_id, show_id, seat_id],
        (err) => {
            if (err) {
                console.error("Database error during booking:", err.message);
                return res.status(500).json({ success: false, error: err.message });
            }

            db.run(
                'UPDATE Seats SET is_available = 0 WHERE seat_id = ?',
                [seat_id],
                function (err) {
                    if (err) {
                        console.error("Database error updating seat:", err.message);
                        return res.status(500).json({ success: false, error: err.message });
                    }
                    db.get('SELECT * FROM Movies WHERE movie_id = ?', [show_id], (err, movie) => {
                        if (err) {
                            console.error("Database error fetching movie:", err.message);
                            return res.status(500).json({ success: false, error: err.message });
                        }
                        if (!movie) {
                            console.error("Movie not found for show_id:", show_id);
                            return res.status(404).json({ success: false, error: 'Movie not found for this show.' });
                        }
                        res.status(201).json({
                            message: 'Booking is successful',
                            booking_id: this.lastID,
                            movie: movie,
                            seat: seat_id
                        });
                    });
                }
            );
        }
    );
});

app.listen(port, () => {
    console.log(`App is running successfully at port ${port}`);
});