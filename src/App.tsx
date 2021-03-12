import { gql, useMutation, useQuery } from '@apollo/client'

const READ_BOOKS = gql`
    query readBooks {
        books {
            name
            id
        }
    }
`

const WRITE_QUERY = gql`
    mutation createBook($name: String!) {
        createBook(name: $name) {
            name
        }
    }
`
function App() {
    const { loading, error, data } = useQuery(READ_BOOKS)

    const [
        createBook,
        { loading: creating, error: creatingError },
    ] = useMutation(WRITE_QUERY, {
        update: (cache, { data: { createBook } }) => {
            cache.modify({
                fields: {
                    books(books = []) {
                        return [createBook, ...books]
                    },
                },
            })
        },
    })

    return (
        <>
            {loading && <h1> Loading...</h1>}
            {error && <h1> Error {error.message}</h1>}

            {creating && <>creating...</>}
            {creatingError && <>{creatingError.message}</>}

            <input
                type='text'
                autoComplete='off'
                spellCheck={false}
                autoFocus={true}
                onKeyUp={(evt): void => {
                    if (
                        evt.key === 'Enter' &&
                        evt.currentTarget.value.length > 0
                    ) {
                        createBook({
                            variables: { name: evt.currentTarget.value.trim() },
                        })

                        evt.currentTarget.value = ''
                    }
                }}
                placeholder='Todo ...'
            />

            {data && (
                <ul>
                    {data.books.map((book: any) => (
                        <li key={book.id}>{book.name}</li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default App
