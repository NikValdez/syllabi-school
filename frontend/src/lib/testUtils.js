import casual from 'casual'

casual.seed(777)
const fakeUser = () => ({
  __typename: 'User',
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  institution: casual.title
})

export { fakeUser }
