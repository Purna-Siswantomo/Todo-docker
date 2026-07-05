FROM php:8.3-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev \
    oniguruma-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_sqlite \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    xml

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application code first (needed for artisan during composer install)
COPY . .

# Copy .env.example to .env for key generation
RUN cp .env.example .env

# Install PHP dependencies (without --no-dev to include Laravel Pail)
RUN composer install --optimize-autoloader --no-interaction

# Generate application key
RUN php artisan key:generate --force

# Prepare SQLite database file for container build
RUN touch database/database.sqlite

# Run migrations
RUN php artisan migrate --force

# Expose port 8000 for PHP built-in server
EXPOSE 8000

# Start PHP built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
