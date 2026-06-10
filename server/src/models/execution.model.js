import mongoose from 'mongoose';

const executionResultSchema = new mongoose.Schema(
  {
    stepId: String,
    label: String,
    type: String,
    status: {
      type: String,
      enum: ['success', 'skipped', 'failed'],
      required: true
    },
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    message: String,
    durationMs: Number
  },
  { _id: false }
);

const executionSchema = new mongoose.Schema(
  {
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true
    },
    initialInput: mongoose.Schema.Types.Mixed,
    finalOutput: mongoose.Schema.Types.Mixed,
    results: [executionResultSchema],
    error: String
  },
  { timestamps: true }
);

export const Execution = mongoose.model('Execution', executionSchema);
