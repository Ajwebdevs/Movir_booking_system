const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
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
  db.all(
    'SELECT * FROM Shows WHERE movie_id = ?',
    [movie_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ shows: rows });
    }
  );
});

app.post('/create_movie', (req, res) => {
  const { title, genre, duration, rating, image_url } = req.body;

  const stmt = db.prepare('INSERT INTO Movies (title, genre, duration, rating, image_url) VALUES (?, ?, ?, ?, ?)');
  stmt.run([title, genre, duration, rating, image_url], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

app.get('/seats/:show_id', (req, res) => {
  const { show_id } = req.params;
  db.all(
    'SELECT * FROM Seats WHERE show_id = ? AND is_available = 1',
    [show_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ seats: rows });
    }
  );
});

app.get('/check_booking/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  db.get(
    'SELECT * FROM Bookings WHERE booking_id = ?',
    [bookingId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ booking: row });
    }
  );
});

app.post('/book_ticket', (req, res) => {
  const { customer_id, show_id, seat_id } = req.body;

  db.run(
    'INSERT INTO Bookings (customer_id, show_id, seat_id) VALUES (?, ?, ?)',
    [customer_id, show_id, seat_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run(
        'UPDATE Seats SET is_available = 0 WHERE seat_id = ?',
        [seat_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Get the movie details
          db.get('SELECT * FROM Movies WHERE id = ?', [show_id], (err, movie) => {
            if (err) {
              return res.status(500).json({ error: err.message });
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

