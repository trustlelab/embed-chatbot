interface AppChatIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const AppSendIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5525 6.38248L7.1325 3.17248C2.82 1.01248 1.05 2.78248 3.21 7.09498L3.8625 8.39998C4.05 8.78248 4.05 9.22498 3.8625 9.60748L3.21 10.905C1.05 15.2175 2.8125 16.9875 7.1325 14.8275L13.5525 11.6175C16.4325 10.1775 16.4325 7.82248 13.5525 6.38248ZM11.13 9.56248H7.08C6.7725 9.56248 6.5175 9.30748 6.5175 8.99998C6.5175 8.69248 6.7725 8.43748 7.08 8.43748H11.13C11.4375 8.43748 11.6925 8.69248 11.6925 8.99998C11.6925 9.30748 11.4375 9.56248 11.13 9.56248Z"
        fill="#4AFF00"
      />
    </svg>
  );
};

const AppChatIcon: React.FC<AppChatIconProps> = ({
  width = 34,
  height = 34,
  fill = "black",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9.84216"
        y="10.7368"
        width="16.1053"
        height="14.3158"
        fill="#4AFF00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 4.25C13.6185 4.25 10.3755 5.5933 7.98439 7.98439C5.5933 10.3755 4.25 13.6185 4.25 17C4.25 20.3815 5.5933 23.6245 7.98439 26.0156C10.3755 28.4067 13.6185 29.75 17 29.75H23.375C25.3555 29.75 26.3458 29.75 27.1263 29.427C27.6421 29.2134 28.1108 28.9003 28.5055 28.5055C28.9003 28.1108 29.2134 27.6421 29.427 27.1263C29.75 26.3458 29.75 25.3555 29.75 23.375V17C29.75 13.6185 28.4067 10.3755 26.0156 7.98439C23.6245 5.5933 20.3815 4.25 17 4.25ZM11.3333 15.5833C11.3333 15.2076 11.4826 14.8473 11.7483 14.5816C12.0139 14.3159 12.3743 14.1667 12.75 14.1667H21.25C21.6257 14.1667 21.9861 14.3159 22.2517 14.5816C22.5174 14.8473 22.6667 15.2076 22.6667 15.5833C22.6667 15.9591 22.5174 16.3194 22.2517 16.5851C21.9861 16.8507 21.6257 17 21.25 17H12.75C12.3743 17 12.0139 16.8507 11.7483 16.5851C11.4826 16.3194 11.3333 15.9591 11.3333 15.5833ZM15.5833 21.25C15.5833 20.8743 15.7326 20.5139 15.9983 20.2483C16.2639 19.9826 16.6243 19.8333 17 19.8333H21.25C21.6257 19.8333 21.9861 19.9826 22.2517 20.2483C22.5174 20.5139 22.6667 20.8743 22.6667 21.25C22.6667 21.6257 22.5174 21.9861 22.2517 22.2517C21.9861 22.5174 21.6257 22.6667 21.25 22.6667H17C16.6243 22.6667 16.2639 22.5174 15.9983 22.2517C15.7326 21.9861 15.5833 21.6257 15.5833 21.25Z"
        fill={fill}
      />
    </svg>
  );
};

const AppMessageIcon: React.FC<AppChatIconProps> = ({
  width = 34,
  height = 34,
  fill = "black",
}) => {
  return (
    <svg
    width={width}
    height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.9583 25H28.2917C27.2083 25 26.1667 25.0417 25.1667 25.1667C13.9583 26.125 8.33334 32.75 8.33334 44.9583V61.625C8.33334 78.2917 15 81.5833 28.2917 81.5833H29.9583C30.875 81.5833 32.0833 82.2083 32.625 82.9167L37.625 89.5833C39.8333 92.5417 43.4167 92.5417 45.625 89.5833L50.625 82.9167C51.25 82.0833 52.25 81.5833 53.2917 81.5833H54.9583C67.1667 81.5833 73.7917 76 74.75 64.75C74.875 63.75 74.9167 62.7083 74.9167 61.625V44.9583C74.9167 31.6667 68.25 25 54.9583 25ZM27.0833 58.3333C24.75 58.3333 22.9167 56.4583 22.9167 54.1667C22.9167 51.875 24.7917 50 27.0833 50C29.375 50 31.25 51.875 31.25 54.1667C31.25 56.4583 29.375 58.3333 27.0833 58.3333ZM41.625 58.3333C39.2917 58.3333 37.4583 56.4583 37.4583 54.1667C37.4583 51.875 39.3333 50 41.625 50C43.9167 50 45.7917 51.875 45.7917 54.1667C45.7917 56.4583 43.9583 58.3333 41.625 58.3333ZM56.2083 58.3333C53.875 58.3333 52.0417 56.4583 52.0417 54.1667C52.0417 51.875 53.9167 50 56.2083 50C58.5 50 60.375 51.875 60.375 54.1667C60.375 56.4583 58.5 58.3333 56.2083 58.3333Z"
        fill="#292D32"
        fillOpacity="0.15"
      />
      <path
        d="M91.5833 28.2916V44.9583C91.5833 53.2916 89 58.9583 83.8333 62.0833C82.5833 62.8333 81.125 61.8333 81.125 60.375L81.1667 44.9583C81.1667 28.2916 71.625 18.75 54.9583 18.75L29.5833 18.7916C28.125 18.7916 27.125 17.3333 27.875 16.0833C31 10.9166 36.6667 8.33331 44.9583 8.33331H71.625C84.9167 8.33331 91.5833 15 91.5833 28.2916Z"
        fill="#292D32"
        fillOpacity="0.15"
      />
    </svg>
  );
};
export { AppChatIcon, AppSendIcon, AppMessageIcon };