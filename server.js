const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// ==========================================
// 🔑 YOUR COMPLETED LIVE CLOUD DATABASE LINK
// ==========================================
const MONGO_URI = "mongodb+srv://rehan_admin:aeKwOJmDOoTruoBm@cluster0.gzlpotl.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("💥 SUCCESS! Connected to Live MongoDB Cloud Database!"))
    .catch(err => console.error("❌ Database Connection Error: ", err));

// Database Blueprint (Schema) for Art Bids
const BidSchema = new mongoose.Schema({
    artId: String,
    highestBid: Number,
    history: Array
});
const Bid = mongoose.model('Bid', BidSchema);

// Real-time Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('👤 A collector joined the live auction room');

    socket.on('placeBid', async (data) => {
        const { artId, newBid, bidderLog } = data;
        
        // Save to Real Cloud Database
        let artwork = await Bid.findOne({ artId });
        if (!artwork) {
            artwork = new Bid({ artId, highestBid: newBid, history: [bidderLog] });
        } else {
            artwork.highestBid = newBid;
            artwork.history.unshift(bidderLog);
        }
        await artwork.save();

        // Broadcast to EVERYONE'S smartphone instantly
        io.emit('updateAuction', { artId, highestBid: newBid, bidderLog });
    });
});

// API Route to load baseline metrics when page refreshes
app.get('/api/auction/:artId', async (req, res) => {
    const artwork = await Bid.findOne({ artId: req.params.artId });
    res.json(artwork || { highestBid: null, history: [] });
});

// Using Port 5001 to avoid address clashes
const PORT = 5001;
server.listen(PORT, () => console.log(`🚀 Live Auction Engine running on port ${PORT}`));
