import mongoose from 'mongoose';

const borrowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  dailyFee: {
    type: Number,
    required: true
  },
  totalFee: {
    type: Number,
    default: 0
  },
  lateFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

borrowingSchema.methods.calculateTotalFee = function() {
  const borrowDays = Math.ceil((new Date() - this.borrowDate) / (1000 * 60 * 60 * 24));
  const baseFee = borrowDays * this.dailyFee;
  
  let lateFee = 0;
  if (new Date() > this.dueDate && this.status !== 'returned') {
    const overdueDays = Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    lateFee = overdueDays * this.dailyFee * 0.5; // 50% extra for late fees
  }
  
  this.lateFee = lateFee;
  this.totalFee = baseFee + lateFee;
  return this.totalFee;
};

export default mongoose.model('Borrowing', borrowingSchema);