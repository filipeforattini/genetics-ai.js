import chalk from 'chalk'
import inquirer from "inquirer";

import { World } from "./src/world.js"
import { pick } from 'lodash-es';

async function main() {
  console.log([
    '',
    '  ' + chalk.greenBright('Thanks for @davidrandallmiller for the inspiration.'),
    '  ' + chalk.cyanBright('Setup your simulation:'),
  ].join('\n\n'))

  const answers = await inquirer.prompt([
    {
      name: 'simulation',
      type: 'checkbox',
      message: 'Choose pre-set simulation:',
      choices: [
        { name: 'east', value: 'east', checked: false },
        { name: 'north', value: 'north', checked: true },
        { name: 'west', value: 'west', checked: false },
        { name: 'south', value: 'south', checked: true },
        { name: 'center', value: 'center', checked: false },
      ],
    },
    {
      name: 'hasObstacles',
      type: 'confirm',
      message: 'Will have obstacles?',
      default: false,
    },
    {
      name: 'size',
      type: 'number',
      message: 'How big is the world?',
      default: 60,
    },
    {
      name: 'generations',
      type: 'number',
      message: 'How many generations will we run?',
      default: 300,
    },
    {
      name: 'generationTicks',
      type: 'number',
      message: 'How many ticks per generations?',
      default: 100,
    },
    {
      name: 'populationSize',
      type: 'number',
      message: 'How many creatures per generation?',
      default: 200,
    },
    {
      name: 'neuronsCount',
      type: 'number',
      message: 'How many neurons per creature?',
      default: 12,
    },
    {
      name: 'genomeSize',
      type: 'number',
      message: 'How many genes per creature?',
      default: 40,
    },
  ])

  const options = {
    worldConfig: pick(answers, ['simulation', 'size', 'generations', 'hasObstacles', 'generationTicks']),
    generationConfig: pick(answers, ['populationSize']),
    individualConfig: pick(answers, ['neuronsCount', 'genomeSize']),
  }

  const world = World.from(options)
  world.initializeGeneration()
  world.multiGeneration(options.worldConfig.generations)
}

main()
