import React, {useState, useRef, useCallback} from 'react'
import {useBookSearch} from './useBookSearch'
import {Container, Grid, Card, CardContent, makeStyles, TextField, List} from '@material-ui/core'
function App() {
  const classes = useStyle();
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const {books, hasMore, loading, error} = useBookSearch(query, pageNumber)


  const observe = useRef()
  const lastBookItemRef = useCallback(node =>{
    if(loading) return
    if(observe.current) observe.current.disconnect()
    observe.current = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber + 1)
        console.log('Visible')
      }
    })
    if(node) observe.current.observe(node)
    //console.log(node)
  }, [loading, hasMore])
  
  function handleSearch(e){
    // console.log("Books",books)
    setQuery(e.target.value)
    setPageNumber(1)

  }
  return (
    <>
    <Container className={classes.useStyle}>
       <Card>
       <h2 className={classes.title}>Search Books</h2>
         <CardContent>
           <Grid container spacing={2}>
             <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
             <TextField type="text" value={query} label="Search book" onChange={handleSearch} />
                {books.map((book, index) =>{
                  if(books.length === index+1){
                    return <div ref={lastBookItemRef} key={book}>{book}</div>
                  }
                  return <div key={book}>{book}</div>
                })}
                <div>{loading && `Loading...`}</div>
                <div>{error && 'Error'}</div>
             </Grid>
             </Grid>
          </CardContent>
        </Card>
        </Container>
    </>
  );
}

const useStyle = makeStyles((theme) =>({
  container: {
    marginTop: 30,
  },
  title:{
    display:'flex',
    justifyItems: 'center',
    textAlign: 'center',
    background: '#0A8E78',
    color: '#fff',
    padding: 20
  }
}))

export default App;
