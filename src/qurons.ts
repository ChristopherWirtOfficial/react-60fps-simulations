interface Quron {
  id: string;
  machine: (...inArr: Array<number>) => Array<number>;

  // To allow for self-referential Qurons, we make this property a function.
  // Otherwise we'd run into problems with using the Quron object before it was declared
  in: () => Array<number | Quron>;
}

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

const nFeelPressureSource = 5;

const nSource = 1;

const primaryFeelQuron: Quron = {
  id: 'primaryFeel',
  machine: (nFeel, nFeelPressure) => {
    // Using our feel
    const outNFeel = nFeel + nFeelPressure;
    return [ outNFeel ];
  },
  in: () => [ primaryFeelQuron, nFeelPressureSource ],
};

const primaryQuron: Quron = {
  id: 'primary',
  machine: (n, nFeel) => {
    // Machine definition

    const nPositiveFeel = 0;

    return [ nPositiveFeel ];
  },
  in: () => [ nSource, primaryFeelQuron ],
};


const qurons = [ primaryQuron, primaryFeelQuron ];
