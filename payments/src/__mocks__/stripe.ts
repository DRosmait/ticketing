export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "some_id" }),
  },
};
