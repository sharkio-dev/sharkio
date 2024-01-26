const DocsImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      {...props}
      style={{
        width: "100%",
        borderWidth: 8,
        borderRadius: 16,
        borderStyle: "solid",
        borderColor: "#6e6e6e",
      }}
    />
  );
};

export default DocsImage;
