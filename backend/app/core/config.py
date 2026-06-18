from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://gocouncil:gocouncil_dev@localhost:5432/gocouncil"
    secret_key: str = "dev_secret_key_change_in_production"
    environment: str = "development"
    allowed_origins: list[str] = ["http://localhost:8081", "http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
