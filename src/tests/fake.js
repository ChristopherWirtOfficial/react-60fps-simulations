const boxes = [
  {
    id: 'IAMABOXGUID',
    name: 'Box 1',
    // Whatever other properties normally exist for a box record

    subscription: {
      subscriptionId: 'IAMASUBSCRIPTIONID',
      paymentProcessor: 'Homevalet',
      paymentProcessorId: '12345',

      active: true,
      cancelled: false, // If true, active can still be true, and enddate would show when it lapses
      startDate: '2019-01-01',
      endDate: '2019-12-31', // Would probably be independant of if it lapses or renews on this date

      claimed: true, // Would never be false if active is true
    },
  },
  {
    id: 'IAMABOXGUID2',
    name: 'Box 2',


  },
];
