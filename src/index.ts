import app from '@/app';

const port = Bun.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server is up and running on port ${port}. Access it at http://localhost:${port}`,
  );
});
