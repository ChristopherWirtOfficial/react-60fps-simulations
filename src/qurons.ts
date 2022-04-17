import { uuid } from './helpers';

/* @ts-ignore ts(1208) */
type QuronValue = number;


/*
 TODO LIST:
 1. Define Quron registry
 - Is it a tree built by walking a reference list from a "base" Quron?
 - Are Qurons passed into a function to register them?

 2. Define dependency structure
  - Can I try one of my cool ideas for an automatically optimized dependency order here?
      Running them dry and re-running them in various orders to deterministically decide optimal ordering?
      It could let me run huge chunks of the tree more efficiently... I think
  - Does each Quron call out its dependencies separately from calling out its definition?
  - Qurons should probably just define their inputs and outputs in terms of literal Quron references, and each Quron
    can be assigned a static runtime key at registration time that is just
      the key in the data store for the snapshot value of that Quron


*/


type TruthQuron = Quron & {
  value: number;
};


type Quron = {
  key?: string;
  value?: number;
};

type MachineQuron = Quron & {
  machine: (...inArr: Array<number>) => number;
  trueMachine?: (state: QuronValues) => number;
  // To allow for self-referential Qurons, we make this property a function.
  // Otherwise we'd run into problems with using the Quron object before it was declared
  in: () => Array<Quron>;
};


/*
    Simple QNN (probably one quron?) that decides if a number is positive or not.

    Abstraction to learn - "Is positive or isn't"
    Lesson Plan:
        - Interrogate it and ask if a given input N is positive (or not).
        - If it's wrong, "punish" it
        - If it's right, "reward" it


    Primary Quron: {
        IN: [N, N_FEEL]
        OUT: [N_POSITIVE_FEEL]

        MACHINE: (N
    }
*/


const nFeelPressureSource: TruthQuron = { key: 'nFeelPressureSource', value: 5 };

const nSource: TruthQuron = { key: 'nSource', value: 1 };

// quron values registery, mapped by key: string to value: number
type QuronValues = { [key: string]: number };
const quronValues: QuronValues = {};

const qurons: MachineQuron[] = [];

// Only MachineQurons are actually run, so TruthQurons aren't registered in the quronValues registry
const runMachines = (state: QuronValues) => {
  qurons.forEach(q => {
    if (!q.trueMachine) {
      console.warn('NO TRUE MACHINE FOR QURON', q);
      return;
    }
    if (!q.key) {
      console.warn('NO KEY FOR QURON', q);
      return;
    }

    const newValue = q.trueMachine(state);
    quronValues[q.key] = newValue;
  });
};


// Create a function `quron` that returns a fully valid and registered quron object from
//  a (potentially) incomplete quron object
const quron = (qIn: MachineQuron): MachineQuron => {
  // If qIn has no key, generate one
  // Register the quron in the registry with the key
  // Set its initial snapshot value to the value of the quron (or 0 if it doesn't have one)
  // Return the quron object

  const key = `${qIn.key || uuid()}`;
  const newron: MachineQuron = {
    ...qIn,
    key,
    value: qIn.value ?? 0,
    trueMachine: (state: QuronValues) => qIn.machine(...qIn.in().map(q => (q.key ? state[q.key] : q.value ?? 0))),
  };

  quronValues[key] = newron?.value ?? 0;
  qurons.push(newron);

  return newron;
};

const primaryFeelQuron: MachineQuron = quron({
  key: 'primaryFeel',
  machine: (nFeel, nFeelPressure) => {
    // Using our feel
    const outNFeel = nFeel + nFeelPressure;
    return outNFeel;
  },
  in: () => [ primaryFeelQuron, nFeelPressureSource ],
});

const primaryQuron: MachineQuron = quron({
  key: 'primary',
  machine: (n, nFeel) => {
    // Machine definition

    const nPositiveFeel = 0;

    return nPositiveFeel;
  },
  in: () => [ nSource, primaryFeelQuron ],
});

console.log('gonna run the machines');

const HOW_MANY = 5;
for (let i = 0; i < HOW_MANY; i++) {
  runMachines(quronValues);
}

console.log('ran the machines');
