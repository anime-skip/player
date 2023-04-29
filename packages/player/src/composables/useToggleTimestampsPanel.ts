export default function () {
  const { view } = useView();
  return () => {
    if (view.value === 'timestamps') view.value = undefined;
    else view.value = 'timestamps';
  };
}
