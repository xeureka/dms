CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  username VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',

  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  original_name VARCHAR(500) NOT NULL,
  stored_name VARCHAR(500) NOT NULL,
  server_path VARCHAR(1000) NOT NULL,
  file_size BIGINT,

  file_hash TEXT, 

  is_deleted BOOLEAN DEFAULT false,

  owner_id UUID NOT NULL,

  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS file_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  file_id UUID NOT NULL ,
  user_id UUID NOT NULL,

  role VARCHAR(20) NOT NULL CHECK (role IN ('view','edit','owner')),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),

  -- referencing the file_id 
  CONSTRAINT fk_file
    FOREIGN KEY(file_id)
    REFERENCES files(id)
    ON DELETE CASCADE,


  -- refernces the user table n
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_access
    UNIQUE(file_id,user_id)
);

CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  file_id UUID NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  access_role VARCHAR(20) NOT NULL,

  expires_at TIMESTAMP,
  
  max_downloads INT,

  is_revoked BOOLEAN DEFAULT FALSE,
  created_by UUID,
  createdAt TIMESTAMP DEFAULT NOW(),

  --references the files table 
  CONSTRAINT fk_file 
    FOREIGN KEY(file_id)
    REFERENCES files(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_creator
    FOREIGN KEY(created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

