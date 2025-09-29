FROM ruby:3.1-alpine

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    nodejs \
    npm \
    tzdata \
    git

# Set working directory
WORKDIR /app

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 && \
    bundle install --without development test

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["rails", "server", "-b", "0.0.0.0"]


