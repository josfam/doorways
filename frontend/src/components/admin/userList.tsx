import { Button } from '../ui/button'

const UserList = ({ data }) => {
  return (
    <ul className="flex flex-col gap-8">
      {data.map((user) => (
        <li
          key={user.id}
          className="flex content-center items-center gap-4 rounded border-2 bg-slate-100 p-4 text-lg"
        >
          <div className="font-semibold">{user.surname}</div>
          <div className="font-semibold">{user.given_name}</div>
          <div>{`( ${user.id} )`}</div>
          <div className="ml-auto flex gap-4">
            <Button className="ml-auto w-30 !bg-sky-600 !p-5 hover:!bg-sky-800 active:!bg-sky-900">
              Update
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default UserList
