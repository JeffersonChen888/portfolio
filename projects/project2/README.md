# CSE 151B PA1

## Overview
This project implements various machine learning experiments, including softmax regression, numerical approximation of gradients, momentum experiments, regularization experiments, and activation experiments. The code is structured to allow easy configuration and execution of different experiments.

## Requirements
- Python 3.x
- numpy
- matplotlib
- copy

## Directory Structure

project/
│
├── main.py # Main script to run experiments
├── constants.py # Configuration constants
├── neuralnet.py # Neural Network Implementation
├── gradient.py # Contains check functions for backprobogation
├── train.py # Training Neural Network
├── util.py # Contains helper functions for loading and processing datasets
├── configs/ # Directory containing configuration YAML files
├── data/ # Directory containing datasets
└── plots/ # Directory for saving plots

## Configuration
Before running the experiments, ensure that the following directories and files are set up correctly:

- **configs/**: Place your YAML configuration files in this directory. The filenames should match the ones referenced in `main.py` (e.g., `config_4.yaml`, `config_5.yaml`, etc.).
- **data/**: Place your dataset files in this directory. The dataset should be compatible with the loading function in `util.py`.

## Running the Code
To run the experiments, follow these steps:

1. Open a terminal and navigate to the project directory.
2. Use the following command to run the main script:
   ```bash
   python main.py --experiment <experiment_name>
   ```
   Replace `<experiment_name>` with one of the following options:
   - `test_softmax`
   - `test_gradients`
   - `test_momentum`
   - `test_regularization`
   - `test_activation`

   If no experiment name is provided, the default is `test_momentum`.

## Example
To run the softmax regression experiment, use:

'''
python main.py --experiment test_softmax
'''
