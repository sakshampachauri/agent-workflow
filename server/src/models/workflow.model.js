import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'textTransform',
        'delay',
        'condition',
        'mockApiCall',
        'jsonExtract',
        'dataValidation',
        'webhook',
        'finalOutput'
      ],
      required: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { _id: true }
);

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    steps: {
      type: [workflowStepSchema],
      validate: {
        validator: (steps) => steps.length > 0,
        message: 'Workflow must contain at least one step'
      }
    }
  },
  { timestamps: true }
);

export const Workflow = mongoose.model('Workflow', workflowSchema);
